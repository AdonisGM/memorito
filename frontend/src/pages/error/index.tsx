import { useRouteError } from 'react-router-dom';
import NotFound from './404';
import { Code } from '@mantine/core';

const ErrorBoundary = () => {
  let error = useRouteError() as any;

  console.log(error);

  if (error.status === 404) return (<NotFound/>)

  return (<Code>{String(error)}</Code>)
};

export default ErrorBoundary;