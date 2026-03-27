export type InvoiceMode = 'invoice' | 'non_invoice';
export type RoundingRule = 'ROUND' | 'FLOOR' | 'CEIL';

export interface TaxableLineInput {
  amountExcludingTax: number;
  taxRatePercent: number;
  taxClass?: 'taxable' | 'non_taxable';
}

export interface TaxEngineConfig {
  mode: InvoiceMode;
  roundingRule: RoundingRule;
  registrationNumber?: string;
}

export interface TaxBucketResult {
  taxRatePercent: number;
  taxableBase: number;
  taxAmount: number;
  grossAmount: number;
}

export interface TaxCalculationResult {
  subtotalExcludingTax: number;
  totalTax: number;
  grandTotal: number;
  buckets: TaxBucketResult[];
  printableRegistrationNumber?: string;
}

const roundByRule = (value: number, rule: RoundingRule): number => {
  switch (rule) {
    case 'FLOOR':
      return Math.floor(value);
    case 'CEIL':
      return Math.ceil(value);
    case 'ROUND':
    default:
      return Math.round(value);
  }
};

export class TaxEngine {
  constructor(private readonly config: TaxEngineConfig) {}

  calculate(lines: TaxableLineInput[]): TaxCalculationResult {
    const taxableLines = lines.filter((line) => (line.taxClass ?? 'taxable') === 'taxable');
    const nonTaxableLines = lines.filter((line) => (line.taxClass ?? 'taxable') !== 'taxable');

    const subtotalExcludingTax = lines.reduce((sum, line) => sum + line.amountExcludingTax, 0);

    if (this.config.mode === 'non_invoice') {
      const flatTax = roundByRule(
        taxableLines.reduce(
          (sum, line) => sum + line.amountExcludingTax * (line.taxRatePercent / 100),
          0
        ),
        this.config.roundingRule
      );

      return {
        subtotalExcludingTax,
        totalTax: flatTax,
        grandTotal: subtotalExcludingTax + flatTax,
        buckets: [
          {
            taxRatePercent: 0,
            taxableBase: taxableLines.reduce((sum, line) => sum + line.amountExcludingTax, 0),
            taxAmount: flatTax,
            grossAmount:
              taxableLines.reduce((sum, line) => sum + line.amountExcludingTax, 0) + flatTax +
              nonTaxableLines.reduce((sum, line) => sum + line.amountExcludingTax, 0)
          }
        ]
      };
    }

    const bucketMap = new Map<number, { base: number; tax: number }>();

    for (const line of taxableLines) {
      const current = bucketMap.get(line.taxRatePercent) ?? { base: 0, tax: 0 };
      current.base += line.amountExcludingTax;
      current.tax += roundByRule(
        line.amountExcludingTax * (line.taxRatePercent / 100),
        this.config.roundingRule
      );
      bucketMap.set(line.taxRatePercent, current);
    }

    const buckets: TaxBucketResult[] = Array.from(bucketMap.entries())
      .map(([taxRatePercent, value]) => ({
        taxRatePercent,
        taxableBase: value.base,
        taxAmount: value.tax,
        grossAmount: value.base + value.tax
      }))
      .sort((a, b) => b.taxRatePercent - a.taxRatePercent);

    const totalTax = buckets.reduce((sum, b) => sum + b.taxAmount, 0);

    return {
      subtotalExcludingTax,
      totalTax,
      grandTotal: subtotalExcludingTax + totalTax,
      buckets,
      printableRegistrationNumber: this.config.registrationNumber
    };
  }
}
