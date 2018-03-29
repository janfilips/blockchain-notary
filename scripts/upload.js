Dropzone.options.dropzoneform = {
    maxFiles: 1,
    uploadMultiple: false,
    init: function () {
        this.on("addedfile", function (file) {
            $("#dropzone").hide();
            $("#upload-buttons").show();
            $("#dropzone-results").show();
            $("[data-file-name]").html(file.name);
            if (file.type) {
                $("[data-file-type]").html(file.type);
            }
            else {
                $("[data-file-type]").html("Unknown");
            }
            $("[data-file-size]").html(file.size);
            $("[data-file-last-modified]").html(file.lastModifiedDate);
            getHash(file);

            // Format file size
            formatFileSize();
        });
    }
};

function formatFileSize() {
    $("[data-file-size]").formatNumber();
    $("[data-file-size]").html($("[data-file-size]").html() + " bytes");
}

function getHash(file) {
    var reader = new FileReader();
    reader.addEventListener("loadend", function (event) { $("#hash-result").html(sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(event.target.result))); getHashOnDone(); });
    reader.readAsBinaryString(file);
}

function getHashOnDone() {
    $("#upload-button-notarise").prop("disabled", false);
    $("#upload-button-cancel").prop("disabled", false);
    $(".spinner").hide();
}

$("#upload-button-cancel").click(function () {
    $("#upload-button-notarise").prop("disabled", true);
    $("#upload-button-cancel").prop("disabled", true);
    $("#upload-buttons").hide();
    $("[data-file-name]").html("Unknown");
    $("[data-file-type]").html("Unknown");
    $("[data-file-size]").html("Unknown");
    $("[data-file-last-modified]").html("Unknown");
    $(".spinner").show();
    $("#hash-result").html("");
    $("#dropzone-results").hide();
    Dropzone.forElement("#dropzoneform").removeAllFiles(true);
    $("#dropzone").show();
});