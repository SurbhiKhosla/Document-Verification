
Dropzone.options.documentDropzone = {
    url: 'http://localhost:3000/upload',
    autoProcessQueue: false,
    maxFilesize: 2, // MB
    acceptedFiles: '.pdf,.jpeg,.docx,.jpg,.png',
    dictDefaultMessage: "<strong>Drag and drop documents here or click to upload</strong>",
    addRemoveLinks: true, 
    dictRemoveFile: "Remove file", 
    init: function() {
        var myDropzone = this;
        var form = document.getElementById('verification-form');
        var validationMessages = document.getElementById('validation-messages');

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            validationMessages.style.color = 'red'; 
            if (myDropzone.getQueuedFiles().length > 0) {
                var documentType = document.getElementById('document-type').value;
                if (documentType) {
                    myDropzone.processQueue();
                } else {
                    validationMessages.textContent = "Please select a document type.";
                }
            } else {
                validationMessages.textContent = "Please upload a document.";
            }
        });

        myDropzone.on("sending", function(file, xhr, formData) {
            var documentType = document.getElementById('document-type').value;
            formData.append("document-type", documentType);
        });

        myDropzone.on("success", function(file, response) {
            validationMessages.textContent = "File uploaded successfully!";
            validationMessages.style.color = 'green';
            addPreviewClickListener(file);
        });

        myDropzone.on("error", function(file, message) {
            myDropzone.removeFile(file);
            if (file.size > 2 * 1024 * 1024) {
                validationMessages.textContent = "File size exceeds the 2MB limit.";
            } else {
                validationMessages.textContent = message;
            }
        });

        myDropzone.on("removedfile", function(file) {
            validationMessages.textContent = "File removed. You can upload another file.";
            validationMessages.style.color = 'red';
        });

        myDropzone.on("addedfile", function(file) {
            validationMessages.textContent = "Accepted formats:PDF,JPG,JPEG,DOCX,PNG *Max file sixe: 2MB*"; 
        });

        function addPreviewClickListener(file) {
            file.previewElement.addEventListener("click", function() {
                var fileUrl = URL.createObjectURL(file);
                window.open(fileUrl, '_blank');
            });
        }
    }
};













