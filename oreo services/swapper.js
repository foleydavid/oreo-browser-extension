chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: replaceCookiesWithOreos,
  });
});

function replaceCookiesWithOreos() {
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = node.textContent.replace(/\bcookie\b/gi, 'Oreo');
    } else {
      node.childNodes.forEach(walk);
    }
  };
  walk(document.body);
}
