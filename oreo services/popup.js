document.getElementById("swapBtn").addEventListener("click", async () => {
  const find = document.getElementById("find").value;
  const replace = document.getElementById("replace").value;

  if (!find) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [find, replace],
    func: (findText, replaceText) => {
      const walk = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const regex = new RegExp(findText, "gi");
          node.textContent = node.textContent.replace(regex, replaceText);
        } else {
          node.childNodes.forEach(walk);
        }
      };
      walk(document.body);
    }
  });
});
