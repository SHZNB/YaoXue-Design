import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportData {
  title: string;
  studentName: string;
  score: number;
  completedAt: string;
  logs: Array<{
    action: string;
    timestamp: string;
    payload?: unknown;
    [key: string]: unknown;
  }>;
}

export const generateReport = async (elementId: string, data: ReportData) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Report element not found');

    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      logging: false,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 封面页
    pdf.setFontSize(22);
    pdf.text("实验报告", 105, 40, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.text(`实验名称: ${data.title}`, 20, 60);
    pdf.text(`学生姓名: ${data.studentName}`, 20, 70);
    pdf.text(`最终得分: ${data.score} / 100`, 20, 80);
    pdf.text(`完成时间: ${data.completedAt}`, 20, 90);

    // 截图页
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);

    // 详细日志页
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text("操作日志详情", 20, 20);
    
    pdf.setFontSize(10);
    let y = 30;
    data.logs.forEach((log, index) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      const time = new Date(log.timestamp).toLocaleTimeString();
      const line = `${index + 1}. [${time}] ${log.action} - ${JSON.stringify(log.payload)}`;
      // 简单的自动换行处理
      const splitText = pdf.splitTextToSize(line, 170);
      pdf.text(splitText, 20, y);
      y += splitText.length * 5 + 2;
    });

    pdf.save(`实验报告_${data.studentName}_${data.title}.pdf`);
    return true;
  } catch (error) {
    console.error('Report generation failed:', error);
    return false;
  }
};
