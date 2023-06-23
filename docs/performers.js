const sortMoiAlwaysLast = (a, b) => {
    let ret
    if (typeof a.reverseFullname !== 'undefined') a = a.reverseFullname
    if (typeof b.reverseFullname !== 'undefined') b = b.reverseFullname
    if (a.startsWith('自分')) ret = -1
    else if (b.startsWith('自分')) ret = 1
    else ret = a.localeCompare(b)
    // console.log(a, b, ret)
    return ret
}
const sortMoiAlwaysFirst = (a, b) => {
    let ret
    if (typeof a.reverseFullname !== 'undefined') a = a.reverseFullname
    if (typeof b.reverseFullname !== 'undefined') b = b.reverseFullname
    if (a.startsWith('自分')) ret = 1
    else if (b.startsWith('自分')) ret = -1
    else ret = a.localeCompare(b)
    // console.log(a, b, ret)
    return ret
}

window.onload = function () {
    document.getElementById('name').classList.add('sorted_desc')
    document.querySelectorAll('th.sortable').forEach((element) => { // Table headers
        element.addEventListener('click', function () {
            let table = this.closest('table');

            // If the column is sortable
            if (this.querySelector('span')) {
                let previousOrder = undefined
                if (element.classList.contains("sorted_asc")) {
                    previousOrder = 'asc'
                } if (element.classList.contains("sorted_desc")) {
                    previousOrder = 'desc'
                }
                let separator = '-----'; // Separate the value of it's index, so data keeps intact

                let value_list = {}; // <tr> Object
                let obj_key = []; // Values of selected column

                let string_count = 0;
                let number_count = 0;

                const cell_index = element.cellIndex < 3 ? element.cellIndex : element.cellIndex + 1

                // <tbody> rows
                table.querySelectorAll('tbody tr').forEach((line, index_line) => {
                    // Value of each field
                    let key = line.children[cell_index].textContent.toUpperCase();

                    // Check if value is date, numeric or string
                    if (line.children[cell_index].hasAttribute('data-timestamp')) {
                        // if value is date, we store it's timestamp, so we can sort like a number
                        key = line.children[cell_index].getAttribute('data-timestamp');
                        number_count++;
                    }
                    else if (line.children[cell_index].hasAttribute('data-lastname')) {
                        key = line.children[cell_index].getAttribute('data-lastname');
                    }
                    else if (line.children[cell_index].hasAttribute('data-number')) {
                        key = line.children[cell_index].getAttribute('data-number');
                        number_count++;
                    }
                    else if (/^[0-9,.]*$/g.test(key.replace('-', ''))) { // key.replace('-', '').test(/^[0-9,.]*$/g)
                        number_count++;
                    }
                    else {
                        string_count++;
                    }

                    value_list[key + separator + index_line] = line.outerHTML.replace(/(\t)|(\n)/g, ''); // Adding <tr> to object
                    obj_key.push(key + separator + index_line);
                });
                if (string_count === 0 && number_count > 0) { // If all values are numeric
                    obj_key.sort(function (a, b) {
                        return a.split(separator)[0] - b.split(separator)[0];
                    });
                }
                else {
                    if (typeof sortMoiAlwaysLast !== 'undefined' && 
                        typeof sortMoiAlwaysFirst !== 'undefined' ) {
                        if (previousOrder === 'desc') {
                            obj_key.sort(sortMoiAlwaysLast);
                        } else {
                            obj_key.sort(sortMoiAlwaysFirst);
                        }
                    } else {
                        if (previousOrder === 'desc') {
                            obj_key.sort();
                        } else {
                            obj_key.sort();
                        }
                    }
                }

                table.querySelectorAll('thead tr th ').forEach((line, index_line) => {
                    line.classList.remove("sorted_asc")
                    line.classList.remove("sorted_desc")
                })

                if (typeof previousOrder === 'undefined') {
                    element.classList.add("sorted_desc")
                } else if (previousOrder === 'desc') {
                    obj_key.reverse();
                    element.classList.add("sorted_asc")
                } else if (previousOrder === 'asc') {
                    element.classList.add("sorted_desc")
                } else {
                    throw Error('non si può')
                }

                let html = '';
                obj_key.forEach(function (chave) {
                    html += value_list[chave];
                });
                table.getElementsByTagName('tbody')[0].innerHTML = html;
            }
        });
    });
}
