// Accessing jsPDF from window.jspdf.jsPDF
const { jsPDF } = window.jspdf;

// Handle file selection
document.getElementById('fileInputButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function () {
    handleFiles(this.files);
});

const dragArea = document.getElementById('dragArea');

dragArea.addEventListener('dragover', function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    dragArea.style.backgroundColor = '#f0f8ff';
});

dragArea.addEventListener('dragleave', function () {
    dragArea.style.backgroundColor = '';
});

dragArea.addEventListener('drop', function (event) {
    event.preventDefault();
    dragArea.style.backgroundColor = '';
    handleFiles(event.dataTransfer.files);
});

function handleFiles(files) {
    const uploadedFilesContainer = document.getElementById('uploadedFilesContainer');
    const OR = document.getElementById('oR');
    uploadedFilesContainer.innerHTML = ''; // Clear previous uploaded files

    const validFiles = Array.from(files).filter(file => file.type === 'image/png');
    const totalFiles = validFiles.length;

    // Hide the selection and drag area if files are selected
    if (totalFiles > 0) {
        document.getElementById('fileInputButton').style.display = 'none';
        dragArea.style.display = 'none';
        OR.style.display = 'none';
    }

    validFiles.forEach((file, index) => {
        // Create new uploadedFiles section if necessary
        let uploadedFilesSection;
        if (index % 6 === 0) {
            uploadedFilesSection = document.createElement('div');
            uploadedFilesSection.className = 'uploadedFiles';
            uploadedFilesContainer.appendChild(uploadedFilesSection);
        } else {
            uploadedFilesSection = uploadedFilesContainer.lastChild;
        }

        // Create fileBox
        const fileBox = document.createElement('div');
        fileBox.className = 'fileBox';
        fileBox.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        uploadedFilesSection.appendChild(fileBox);
    });

    // Show appropriate button based on number of files
    document.querySelector('.convertBtn').style.display = totalFiles === 1 ? 'block' : 'none';
    document.querySelector('.combineBtn').style.display = totalFiles > 1 ? 'block' : 'none';
}

// Convert a single JPG to PDF
document.querySelector('.convertBtn').addEventListener('click', function () {
    const pdf = new jsPDF();
    const imgData = document.querySelector('.fileBox').style.backgroundImage.slice(5, -2);
    pdf.addImage(imgData, 'png', 10, 10, 190, 190);
    pdf.save('simply-convert-single-image.pdf');
});

// Combine all JPGs into a single PDF
document.querySelector('.combineBtn').addEventListener('click', function () {
    const pdf = new jsPDF();
    const boxes = document.querySelectorAll('.fileBox');
    let count = 0;

    boxes.forEach((box, index) => {
        const imgData = box.style.backgroundImage.slice(5, -2);
        pdf.addImage(imgData, 'png', 10, 10, 190, 190);
        count++;

        if (count < boxes.length) {
            pdf.addPage();
        }
    });

    pdf.save('simply-convert-combined-images.pdf');
});
