chrome.commands.onCommand.addListener((command) => {
  if (command === "focus-search") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if(tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "focusSearch"})
      }
    })
  }
  if (command === "toggle-show-all") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if(tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleShowAll"})
      }
    })
  }
})