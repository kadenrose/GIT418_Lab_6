$(function () {
    $("#fetchQuotesBtn").click(function () {
        // Get selected topic and count from drop-down lists
        const selectedTopic = $("#topicSelection option:selected").val();
        const selectedCount = $("#countSelection option:selected").val();
        fetchQuotes(selectedTopic, selectedCount);
    });
});

function fetchQuotes(topic, count) {
    const cnt = Number(count);
   // TODO: Modify to use $.get() or $.ajax()
    $.get(`https://wp.zybooks.com/quotes.php`, {
        topic: topic, count: cnt }, function(data) {
        renderQuotesResponse(data, topic);
    }, "json").fail(function(jqXHR, textStatus, errorThrown){
        $("#quotes").html(`<p>Topic '${$("#topicSelection.selected")}' not found</p>`);
        console.log("AJAX FAIL:", textStatus, errorThrown);
    });

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
    $("#quotes").html(`<p>No quotes found for topic '${escapeHtml(topic)}'.</p>`);
    } else if (data && data.error) {
    $("#quotes").html(`<p>${escapeHtml(data.error)}</p>`);
    } else {
    $("#quotes").html("<p>Unexpected response format.</p>");
    console.log("Unexpected response:", data);
    }
}
