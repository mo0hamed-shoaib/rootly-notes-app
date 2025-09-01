"use client"

export function NotesPrintStyles() {
  const css = `@media print {
  /* Force light mode for printing */
  .notes-page { 
    background: #ffffff !important; 
    color: #111 !important; 
  }

  /* Remove global chrome in print when on Notes page */
  header, footer { display: none !important; }

  .notes-page .notes-controls,
  .notes-page .notes-export,
  .notes-page nav,
  .notes-page [role="navigation"],
  .notes-page button,
  .notes-page .note-actions,
  .notes-page .pagination,
  .notes-page .Pagination,
  .notes-page .ToastViewport,
  .notes-page .theme-toggle { display: none !important; }

  .notes-page .notes-grid { display: block !important; }
  .notes-page .notes-grid > * { break-inside: avoid; page-break-inside: avoid; margin-bottom: 16px; }

  .notes-page [data-print-card] { 
    box-shadow: none !important; 
    border: 1px solid #111 !important; 
    background: #ffffff !important;
  }

  /* Force light mode colors for all text */
  .notes-page .text-muted-foreground { color: #111 !important; }
  .notes-page h1, .notes-page h2, .notes-page h3, .notes-page h4, .notes-page p { color: #111 !important; }
  .notes-page .badge,
  .notes-page .Badge,
  .notes-page [class*="badge"] { 
    color: #111 !important; 
    border-color: #111 !important; 
    background: #ffffff !important;
  }
  
  /* Force light mode for all colored elements */
  .notes-page .text-orange-600 { color: #111 !important; }
  .notes-page .border-orange-600 { border-color: #111 !important; }
  .notes-page .text-violet-600 { color: #111 !important; }
  .notes-page .border-violet-600 { border-color: #111 !important; }
  .notes-page .text-red-500 { color: #111 !important; }
  .notes-page .text-blue-500 { color: #111 !important; }
  .notes-page .text-green-500 { color: #111 !important; }
  .notes-page .text-yellow-500 { color: #111 !important; }

  /* Neutralize colored badge backgrounds for high-contrast printing */
  .notes-page .bg-red-500,
  .notes-page .bg-orange-500,
  .notes-page .bg-yellow-500,
  .notes-page .bg-blue-500,
  .notes-page .bg-green-500,
  .notes-page .bg-violet-500 { 
    background: #ffffff !important; 
    color: #111 !important; 
    border: 1px solid #111 !important; 
  }

  /* Force light backgrounds */
  .notes-page .bg-muted { background: #f5f5f5 !important; }
  .notes-page .bg-muted\\/30 { background: #f5f5f5 !important; }
  .notes-page .bg-muted\\/50 { background: #f5f5f5 !important; }

  /* Code snippet print styles - with proper text wrapping */
  .notes-page pre,
  .notes-page code,
  .notes-page [class*="syntax-highlighter"],
  .notes-page [class*="prism"],
  .notes-page [class*="hljs"] {
    font-family: 'Courier New', Courier, monospace !important;
    font-size: 10pt !important;
    line-height: 1.6 !important;
    background: #f8f8f8 !important;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    padding: 12px !important;
    margin: 8px 0 !important;
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    color: #111 !important;
    overflow: visible !important;
    display: block !important;
    max-width: 100% !important;
  }

  /* Ensure code inside pre tags is properly formatted with wrapping */
  .notes-page pre code {
    font-family: 'Courier New', Courier, monospace !important;
    font-size: 10pt !important;
    line-height: 1.6 !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    color: #111 !important;
    overflow: visible !important;
    display: block !important;
    max-width: 100% !important;
  }

  /* Code snippet container */
  .notes-page .code-snippet-container {
    margin: 12px 0 !important;
    page-break-inside: avoid !important;
  }

  /* Code snippet label */
  .notes-page .code-snippet-label {
    font-weight: bold !important;
    color: #111 !important;
    margin-bottom: 4px !important;
    font-size: 11pt !important;
  }

  /* Language indicator */
  .notes-page .code-language {
    font-size: 9pt !important;
    color: #666 !important;
    font-style: italic !important;
    margin-bottom: 4px !important;
  }

  .notes-page h1 { font-size: 20pt !important; margin-bottom: 8pt !important; }
  .notes-page h3 { font-size: 13pt !important; }
  .notes-page p, .notes-page li { font-size: 11pt !important; line-height: 1.5 !important; }

  .notes-page mark { background: #fff59d !important; color: inherit !important; }

  @page { size: A4; margin: 16mm; }
}`

  return <style media="print" dangerouslySetInnerHTML={{ __html: css }} />
}


