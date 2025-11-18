$(function () {
    $("#fetchQuotesBtn").click(function () {
        // Get selected topic and count from drop-down lists
        const selectedTopic = $("#topicSelection option:selected").val();
        const selectedCount = $("#countSelection option:selected").val();
        fetchQuotes(selectedTopic, selectedCount);
    });
});

function fetchQuotes(topic, count) {
    $.get(
        "https://wp.zybooks.com/quotes.php",
        { topic: topic, count: count },
        function(data) {

            if (Array.isArray(data)) {
                let html = "<ol>";
                data.forEach(function(q) {
                    html += `<li>${q.quote} - ${q.source}</li>`;
                });
                html += "</ol>";
                $("#quotes").html(html);
            }

            else if (data.error) {
                $("#quotes").text(data.error);
            }
        },
        "json"
    );


    // let html = "<ol>";
    // for (let c = 0; c < count; c++) {
    //     html += `<li></li>`;
    // }
    // html += "</ol>";

    // $("#quotes").html(html);
}

function renderQuotesResponse(data, topic) {
    if (Array.isArray(data) && data.length > 0) {
        let html = "<ol>";
        data.forEach(q => {
        html += `<li>${escapeHtml(q.quote || "")} - ${escapeHtml(q.source || "")}</li>`;
    });
    html += "</ol>";
    $("#quotes").html(html);
    } else if (Array.isArray(data) && data.length === 0) {
    $("#quotes").html(`<p>Topic '${escapeHtml(topic)}'not found</p>`);
    } else if (data && data.error) {
    $("#quotes").html(`<p>${escapeHtml(data.error)}</p>`);
    } else {
    $("#quotes").html("<p>Unexpected response format.</p>");
    console.log("Unexpected response:", data);
    }
}


function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
                        .replace(/'/g, "&#039;");
    }