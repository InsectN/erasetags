//@ts-check
main();

//コンソールへの表示メソッド＆制御
let global_use_console_log = false;
function to_console(msg, value) {
    if(global_use_console_log) {
        console.log(`EraseTags: ${msg} value=${value}`);
    }
}

//複数の正規表現のどれかに合致すればtrue
function match_regular(strs, url) {
    for(let s of strs) {
        let re = new RegExp(s);
        if(re.test(url)) {
            return true;
        }
    }
    return false;
}

//不要プロパティをlistで与えて使用する。存在すればエラーを吐く。
function alert_unwanted_properties(list) {
    for(let v of list) {
        if(v) {
            throw new Error("不要プロパティが設定されていました");
        }
    }
}

//ラベル制御
let label_dictionary = {};
function keep_label(elm, label) {
    if(label) {
        label_dictionary[label] = elm;
        to_console("keep label", label);
    }
}

function process_multi_for_under(elm, process) {
    for(let p of process) {
        process_one(elm, new OneProcess(p));
    }
}

//項目の分別と処理を記載。コア部分
function process_one(elm, oneProcess) {
    try {
        //指定があればlabelから検索し直し
        if(oneProcess.goto) {
            elm = label_dictionary[oneProcess.goto];
            to_console("goto label", oneProcess.goto);
        }

        //label指定があれば、現在のelementをラベル辞書に登録。
        keep_label(elm, oneProcess.label);

        //処理分別
        switch(oneProcess.category) {
            case "get":
                switch(oneProcess.method) {
                    case "id":
                        //処理: getElementByIdして次に渡す
                        // alert_unwanted_properties([]);
                        {
                            let next_elm = elm.getElementById(oneProcess.property);
                            if(next_elm) {
                                to_console("get-idで発見", oneProcess.property);
                                process_multi_for_under(next_elm, oneProcess.under);
                            } else {
                                to_console("get-idで発見できず", oneProcess.property);
                            }
                        }
                        break;
                    case "class":
                        //処理: getElementsByClassNameして次に渡す
                        // alert_unwanted_properties([]);
                        {
                            let next_elms = elm.getElementsByClassName(oneProcess.property);
                            if(next_elms.length > 0) {
                                to_console("get-classで発見", oneProcess.property);
                                for(let next_elm of next_elms) {
                                    process_multi_for_under(next_elm, oneProcess.under);
                                }
                            } else {
                                to_console("get-classで発見できず", oneProcess.property);
                            }
                        }
                        break;
                    case "tag":
                        //処理: getElementsByTagNameして次に渡す
                        // alert_unwanted_properties([]);
                        {
                            let next_elms = elm.getElementsByTagName(oneProcess.property);
                            if(next_elms.length > 0) {
                                to_console("get-tagで発見", oneProcess.property);
                                for(let next_elm of next_elms) {
                                    process_multi_for_under(next_elm, oneProcess.under);
                                }
                            } else {
                                to_console("get-tagで発見できず", oneProcess.property);
                            }
                        }
                        break;
                    default:
                        throw new Error("methodの値が不正です", oneProcess.method);
                }
                break;
            case "attr":
                //処理: elm.getAttribute(method) == property なら次に渡す(<div method="property">とかを検出)
                // alert_unwanted_properties([]);
                let attr_name = elm.getAttribute(oneProcess.method);
                if(attr_name == oneProcess.property) {
                    to_console("attrで発見", oneProcess.property);
                    process_multi_for_under(elm, oneProcess.under);
                } else {
                    to_console("attrで発見できず", oneProcess.property);
                }
                break;
            case "style":
                switch(oneProcess.method) {
                    case "display":
                        //処理: elm.style.display != "none"だったらそのまま次に渡す
                        alert_unwanted_properties([oneProcess?.property]);
                        if(elm.style.display != "none") {
                            to_console("style-displayで発見");
                            process_multi_for_under(elm, oneProcess.under);
                        } else {
                            to_console("style-displayで発見できず");
                        }
                        break;
                    default:
                        throw new Error(`methodの値が不正です value=${oneProcess.method}`);
                }
                break;
            case "regular":
                switch(oneProcess.method) {
                    case "id":
                        //処理: elm.idと指定正規表現を比較、合致すればそのまま次に渡す
                        // alert_unwanted_properties([]);
                        if(match_regular(oneProcess.property, elm.id)) {
                            to_console("regular-idで発見", oneProcess.property);
                            process_multi_for_under(elm, oneProcess.under);
                        } else {
                            to_console("regular-idで発見できず", oneProcess.property);
                        }
                        break;
                    case "innerHtml":
                        //処理: elm.innerHTMLと指定正規表現を比較、合致すればそのまま次に渡す
                        // alert_unwanted_properties([]);
                        if(match_regular(oneProcess.property, elm.innerHTML)) {
                            to_console("regular-innerHtmlで発見", oneProcess.property);
                            process_multi_for_under(elm, oneProcess.under);
                        } else {
                            to_console("regular-innerHtmlで発見できず", oneProcess.property);
                        }
                        break;
                    case "textContent":
                        //処理: elm.textContentと指定正規表現を比較、合致すればそのまま次に渡す
                        // alert_unwanted_properties([]);
                        if(match_regular(oneProcess.property, elm.textContent)) {
                            to_console("regular-textContentで発見", oneProcess.property);
                            process_multi_for_under(elm, oneProcess.under);
                        } else {
                            to_console("regular-textContentで発見できず", oneProcess.property);
                        }
                        break;
                    default:
                        throw new Error("methodの値が不正です", oneProcess.method);
                }
                break;
            case "erase":
                switch(oneProcess.method) {
                    case "outerHtml":
                        //処理: elementのouterHtmlに文字列セット
                        alert_unwanted_properties([oneProcess?.under]);
                        elm.outerHTML = oneProcess.property; //HTMLは大文字注意
                        to_console("erase-outerHtml処理済", oneProcess.property);
                        break;
                    case "innerHtml":
                        //処理: elementのinnerHtmlに文字列セット
                        alert_unwanted_properties([oneProcess?.under]);
                        elm.innerHTML = oneProcess.property; //HTMLは大文字注意
                        to_console("erase-innerHtml処理済", oneProcess.property);
                        break;
                    case "innerText":
                        //処理: elementのinnerTextに文字列セット
                        alert_unwanted_properties([oneProcess?.under]);
                        elm.innerText = oneProcess.property;
                        to_console("erase-innerText処理済", oneProcess.property);
                        break;
                    case "remove":
                        //処理: elementをremoveする
                        alert_unwanted_properties([oneProcess?.property, oneProcess?.under]);
                        elm.remove();
                        to_console("erase-remove処理済");
                        break;
                    case "height":
                        //処理: elementのheightを小さくする
                        if(elm.style.height == oneProcess.property) {
                            to_console("erase-heightは既に処理済でした", oneProcess.property);
                        } else {
                            elm.style.height = oneProcess.property;
                            to_console("erase-height処理済", oneProcess.property);
                        }
                        break;
                    default:
                        throw new Error("methodの値が不正です", oneProcess.method);
                }
                break;
            default:
                throw new Error("categoryの値が不正です", oneProcess.category);
        }
    }
    catch(error) {
        to_console("進行できないエラー発生", error);
    }
}

async function main() {
    //設定読み込み
    let url = window.location.href;
    let setting = await get_storage();

    if(setting) {
        //console.logの使用判断
        if(setting.outputLog) {
            global_use_console_log = true;
        }

        //各処理を全て実行
        for(let action of setting.action) {
            if(action.enabled) {
                if(match_regular(action.url, url)) {
                    let doc_ = document;

                    //documentもラベル制御
                    keep_label(doc_, "document");

                    //enabledとurl合致の確認が取れればtimeout処理開始
                    if(action.timeout) {
                        setTimeout(() => {
                            process_multi_for_under(doc_, action.process);
                        }, action.timeoutSecond * 1000);
                    }

                    //enabledとurl合致の確認が取れればリピート処理開始
                    if(action.toRepeat) {
                        setInterval(() => {
                            process_multi_for_under(doc_, action.process);
                        }, action.repeatSecond * 1000);
                    }

                    //検索＆入替処理（初回のみ）
                    process_multi_for_under(doc_, action.process);
                }
            }
        }
    }
}
