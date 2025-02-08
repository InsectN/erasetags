
document.addEventListener("DOMContentLoaded", async () => {
    //読み込み時に設定を拾う
    let setting = await get_storage();

    //オプションのレイアウト
    show(setting);

    //ログ出力の更新
    document.getElementById("output_log").onchange = () => {
        //pending:小型化したほうが良いかもしれん
        collect(setting);
        set_storage(setting);
    };

    //actionの追加
    let add_element = document.getElementById("add_action");
    add_element.onchange = async () => {
        for(let file of add_element.files) {

            //ファイルの中身を読み取る
            let fr = new FileReader();
            fr.onload = () => {
                try {
                    let one_action_text = fr.result;
                    let one_action_json = JSON.parse(one_action_text);
                    if(!is_safe_one_action_json(one_action_json)) {
                        throw new Error("必要最低限の項目が見つかりませんでした");
                    }
                    setting.action.push(one_action_json);
                    set_storage(setting);

                    //pending:再表示

                } catch(e) {
                    alert(`JSONファイルの読み込みに失敗しました\n${e}`)
                }
            };
            fr.readAsText(file);

        }
    };

    //actionの有効/無効
    for(let action_enabled_checkbox of document.getElementsByName("action_enabled")) {
        action_enabled_checkbox.onchange = () => {
            //pending:小型化したほうが良いかもしれん
            collect(setting);
            set_storage(setting);
        };
    }

    //actionの削除
    for(let action_delete of document.getElementsByName("action_delete")) {
        action_delete.onclick = () => {
            //pending:小型化したほうが良いかもしれん
            let yes = window.confirm("本当に削除しますか？");
            if(yes) {

                let index = action_delete.id.replace("action_delete_", "");
                setting.action.splice(index, 1);

                set_storage(setting);

                //pending:再表示
            }
        };
    }
});

//表示
function show(setting) {
    if(setting) {
        //ログ出力
        document.getElementById("output_log").checked = setting.outputLog;

        //actionの表示
        let setting_list = document.getElementById("setting_list");
        setting.action.forEach((action, index) => {

            let d = document.createElement("div");
            d.innerHTML = `<div style="display: flex;">
                                <div>
                                    <label><input type="checkbox" name="action_enabled" id="action_enabled_${index}" ${action.enabled?"checked":""}>${action.title}</label>
                                </div>
                                <div style="margin: 0 0 0 auto;">
                                    <button type="button" name="action_delete" id="action_delete_${index}">削除</button>
                                </div>
                            </div>`;

            setting_list.appendChild(d);
        });
    }
}

//データ回収
function collect(setting) {
    //ログ出力
    setting.outputLog = document.getElementById("output_log").checked;

    //action回収
    let action_enableds = document.getElementsByName("action_enabled");
    for(let i=0; i<action_enableds.length; i++) {
        setting.action[i].enabled = action_enableds[i].checked;
    }
}