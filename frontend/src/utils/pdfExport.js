import jsPDF from 'jspdf';

export const exportAchievementsToPDF = (achievements) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 240, 255);
    doc.text('Robotics Club - Achievements', 20, 20);

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    let yPos = 45;

    achievements.forEach((achievement, index) => {
        // Check if we need a new page
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }

        // Achievement title
        doc.setFontSize(14);
        doc.setTextColor(176, 0, 255);
        doc.text(`${index + 1}. ${achievement.title}`, 20, yPos);
        yPos += 8;

        // Category and date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Category: ${achievement.category} | Date: ${new Date(achievement.date).toLocaleDateString()}`, 20, yPos);
        yPos += 6;

        // Description
        doc.setFontSize(10);
        doc.setTextColor(0);
        const splitDescription = doc.splitTextToSize(achievement.description, 170);
        doc.text(splitDescription, 20, yPos);
        yPos += (splitDescription.length * 5) + 10;
    });

    // Save the PDF
    doc.save('robotics-club-achievements.pdf');
};
