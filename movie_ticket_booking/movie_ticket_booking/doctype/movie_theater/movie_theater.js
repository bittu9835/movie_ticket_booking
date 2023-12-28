// Copyright (c) 2023, Bittu Kumar and contributors
// For license information, please see license.txt

frappe.ui.form.on("Movie Theater", {
    refresh(frm) {

    },
    before_save(frm) {
        if (frm.doc.number_of_sheets) {
            let sh = frm.doc.number_of_sheets?.split('*')
            let capitalAlphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            let columns = {
                column: [],
                row: []
            }
            for (let i = 0; i < Number(sh[0]); i++) {
                if (i > 25) {
                    let index = i % 26
                    columns.column.push(capitalAlphabets[index]+capitalAlphabets[index])
                } else {
                    columns.column.push(capitalAlphabets[i])
                }
            }
            for (let i = 0; i < Number(sh[1]); i++) {
                columns.row.push(i + 1)
            }
            frm.set_value('seat_column', columns)
        }
    },


});
