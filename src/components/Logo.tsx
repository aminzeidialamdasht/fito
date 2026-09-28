/** لوگوی کوچینو (مشت + دمبل). فایل: public/logo.png */
export default function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="./logo.png"
      alt="کوچینو"
      width={size}
      height={size}
      draggable={false}
      className={'object-contain select-none ' + className}
      style={{ width: size, height: size }}
    />
  );
}
