export class Meta {
  private code: number;
  private message: string;
  private version: string;

  constructor(version?: string, code?: number, message?: string) {
    this.code = code ?? 200;
    this.message = message ?? "success";
    this.version = version  ?? "";
  }
}
