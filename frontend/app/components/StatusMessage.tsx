type StatusMessageProps = {
  error?: string;
  success?: string;
};

export default function StatusMessage({ error, success }: StatusMessageProps) {
  if (!error && !success) {
    return null;
  }

  return (
    <p
      className={`rounded-md px-3 py-2 text-sm ${
        error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {error || success}
    </p>
  );
}
