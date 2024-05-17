export const importValue = (exportName: string): SafeAny =>
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ({ 'Fn::ImportValue': exportName });
