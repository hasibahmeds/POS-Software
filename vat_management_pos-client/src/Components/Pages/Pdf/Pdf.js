import React, { useRef } from 'react';
import DownloadContent from './DownloadContent';
import generatePDF from './generatePDF';

const Pdf = () => {
  const contentRef = useRef(null);

  const handleDownloadPDF = () => {
    generatePDF(contentRef, 'downloaded_content');
  };
  return (
    <div>
      <h1>React PDF Download Example</h1>
      <button onClick={handleDownloadPDF}>Download as PDF</button>
      <div ref={contentRef}>
        <DownloadContent />
      </div>
    </div>
  );
};

export default Pdf;
