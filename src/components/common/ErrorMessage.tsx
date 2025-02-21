interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return <p className="text-symantic-negative text-xs">{message}</p>;
};

export default ErrorMessage;
