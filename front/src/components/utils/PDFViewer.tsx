import React, { useRef, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | Uint8Array; // URL or a Uint8Array of the PDF
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [width, setWidth] = useState(0); // State to store the width of the container
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container element

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      // Assuming there's only one entry because we're observing a single element
      if (entries[0]) {
        setWidth(entries[0].contentRect.width); // Update width based on the container's width
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup observer on component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div ref={containerRef} style={{ width: '100%' }}> {/* Use this div as a container to control the width */}
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page 
            key={`page_${index + 1}`} 
            pageNumber={index + 1} 
            width={width} // Set the page width to fill the container
            renderTextLayer={false}
          />
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;
