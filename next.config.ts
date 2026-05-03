import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /** Geliştirme modunda köşedeki “N” göstergesini kapatır; hata overlay’i çalışmaya devam eder. */
  devIndicators: false,
};

export default nextConfig;
