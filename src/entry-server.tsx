import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';
import { StaticRouter } from 'react-router';

export function render(url: string) {
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
    </StaticRouter>
  );
  return { html };
}
