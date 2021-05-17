function toggleModalButtons() {
    if (addButton.disabled === true) {
        addButton.disabled = false;
        addButton.style.opacity = 1;
        addButton.innerText = 'Add Item';
        cancelButton.style.display = 'inline';
    } else {
        addButton.disabled = true;
        addButton.style.opacity = 0.5;
        addButton.innerText = 'Adding...';
        cancelButton.style.display = 'none';
    }
}

function save() {
    localStorage.setItem('readit-items', JSON.stringify(allItems))
}

function addItem(item) {
    allItems.push(item)
    save()
    renderItem(item)
}

function renderItem(item) {
    const div = document.createElement('div')
    div.setAttribute('class', 'read-item')
    div.setAttribute('data-url', item.url)
    div.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`
    itemsDiv.appendChild(div)
    div.addEventListener('click', selectItem)
    div.addEventListener('dblclick', openItem)
}

function selectItem(e) {
    getSelectedItem()?.node?.classList?.remove('selected');
    e.currentTarget.classList.add('selected');
}

function changeSelection(direction) {
    let currentItem = getSelectedItem()?.node;
    if (!currentItem) {
        currentItem = document.getElementsByClassName('read-item')[0];
        return currentItem.classList.add('selected');
    }

    if (direction === 'ArrowUp' && currentItem.previousElementSibling) {
        currentItem.classList.remove('selected');
        currentItem.previousElementSibling.classList.add('selected');
    } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
        currentItem.classList.remove('selected');
        currentItem.nextElementSibling.classList.add('selected');
    }

}

function openItem() {
    if (!allItems.length) return

    const selectedItem = getSelectedItem()
    if (!selectedItem) return

    const contentUrl = selectedItem.node.dataset.url

    readerWin = window.open(contentUrl, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1,
        frame=0
    `)

    //readerWin.removeMenu()

    readerWin.eval(readerJs.replace('{{index}}', selectedItem.index));
}

function getSelectedItem() {
    const currentItem = document.getElementsByClassName('read-item selected')[0]
    if (!currentItem) return

    let itemIndex = 0
    let child = currentItem
    while ((child = child.previousElementSibling) != null) itemIndex++

    return { node: currentItem, index: itemIndex }
}

function deleteItem(itemIndex) {
    itemsDiv.removeChild(itemsDiv.childNodes[itemIndex]);
    allItems.splice(itemIndex, 1);
    save()
    if (allItems.length) {
        let newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
}

function openItemInBrowser() {
    if (!allItems.length) return

    const selectedItem = getSelectedItem()
    if (!selectedItem) return

    const contentUrl = selectedItem.node.dataset.url

    electronProxy.shell.openExternal(contentUrl)
}