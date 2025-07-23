
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId + '-tab').classList.add('active');
}

function allowDrop(ev) {
    ev.preventDefault();
    ev.target.style.background = "#e0e0ff";
}

function handleDrop(ev) {
    ev.preventDefault();
    ev.target.style.background = "";
    alert("Files dropped! (Simulated processing)");
}

function manageSections() {
    alert("Section manager coming soon!");
}
