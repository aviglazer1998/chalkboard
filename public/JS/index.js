function onlyOne(checkbox){
    var checkboxes = document.getElementsByClassName('boxes')
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
}