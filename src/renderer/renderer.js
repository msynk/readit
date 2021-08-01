const el = document.getElementById.bind(document),
    showButton = el('show-button'),
    cancelButton = el('cancel-button'),
    modal = el('modal'),
    addButton = el('add-button'),
    urlInput = el('url-input'),
    itemsDiv = el('items-div'),
    searchInput = el('search-input'),
    requestPermissionButton = el('request-permission'),
    allItems = JSON.parse(localStorage.getItem('readit-items')) || [];

allItems.forEach(renderItem)

electronProxy.ipc.on('menu-add-item', e => {
    showButton.click()
})
electronProxy.ipc.on('menu-open-item', e => {
    openItem()
})
electronProxy.ipc.on('menu-delete-item', e => {
    let selectedItem = getSelectedItem()
    deleteItem(selectedItem.index)
})
electronProxy.ipc.on('menu-open-browser-item', e => {
    openItemInBrowser()
})
electronProxy.ipc.on('menu-search-item', e => {
    searchInput.focus()
})
electronProxy.ipc.on('menu-google-signin', (e, tokens) => {
    alert(tokens.access_token)
})

window.addEventListener('message', e => {
    if (e.data.action === 'delete-reader-item') {
        deleteItem(e.data.itemIndex)
        e.source.close();
    }
})

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        changeSelection(e.key);
    }
})

showButton.addEventListener('click', e => {
    modal.style.display = 'flex';
    urlInput.focus();
})

searchInput.addEventListener('keyup', e => {
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        const hasMatch = item.innerText.toLowerCase().includes(searchInput.value)
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})

addButton.addEventListener('click', e => {
    const value = urlInput.value;
    if (!value) return;
    electronProxy.ipc.invoke('new-item', value).then(newItem => {
        addItem(newItem);
        toggleModalButtons();
        modal.style.display = 'none';
        urlInput.value = '';
    }).catch(err => {
        console.error(err);
    });
    toggleModalButtons();
})

cancelButton.addEventListener('click', e => {
    modal.style.display = 'none';
})

urlInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') addButton.click();
})

let readerJs
electronProxy.readFile('reader-script.js', (err, data) => {
    readerJs = data.toString()
})


requestPermissionButton.addEventListener('click', e => {
    console.log('norification permission:', Notification.permission)
    if (!("Notification" in window)) {
      return console.log("This browser does not support desktop notification");
    }
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      } else {
        console.log('permission denied:', permission)
      }
    });
})