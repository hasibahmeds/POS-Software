import html2pdf from 'html2pdf.js';

const generatePDF = async (contentNode, fileName) => {
  try {
    const opt = {
      margin: 10,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    const element = contentNode.current;
    await html2pdf().from(element).set(opt).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export default generatePDF;
