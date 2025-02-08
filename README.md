# erasetags
Chrome拡張機能「自動タグ削除」

sampleディレクトリ内のjsonを読み込ませれば稼働します。

## 例
Yahoo表示時、以下のタイミングで mainタグ内を全消去
1. 読み込み直後
1. 読み込み直後から3秒後(遅延読込対策のため)
1. (無効化)読み込み直後から15秒おき
```
{
    "title"  : "サンプル",
    "enabled": true,
    "url": ["^https://www\\.yahoo\\.co\\.jp/"],
    "timeout"       : true,
    "timeoutSecond" : 3,
    "toRepeat"    : false,
    "repeatSecond": 15,
    "process": [
        {
            "category"  : "get",
            "method"    : "tag",
            "property"  : "main",
            "under": [
                {
                    "category"  : "erase",
                    "method"    : "innerHtml",
                    "property"  : ""
                }
            ]
        }
    ]
}
```
## 記述方法


記述方法|使用不可|内容
---|---|---
"category": "get", "method": "id",    "property": "(ユーザ指定)", "under": [ (下位要素) ]               |                       |`element.getElementById(property)`
"category": "get", "method": "class", "property": "(ユーザ指定)", "under": [ (下位要素) ]               |                       |`element.getElementsByClassName(property)`
"category": "get", "method": "tag",   "property": "(ユーザ指定)", "under": [ (下位要素) ]               |                       |`element.getElementsByTagName(property)`
"category": "attr", "method": "(ユーザ指定)", "property": "(ユーザ指定)", "under": [ (下位要素) ]       |                       |`element.getAttribute(method) == property` 
"category": "style", "method": "display", "under": [ (下位要素) ]                                       |propertyなし           |`element.style.display != "none"` 
"category": "regular", "method": "id",          "property": ["(ユーザ指定)"], "under": [ (下位要素) ]     |                       |`/property/.test(element.id)` を複数→ひとつでもtrueなら次へ
"category": "regular", "method": "innerHtml",   "property": ["(ユーザ指定)"], "under": [ (下位要素) ]     |                       |`/property/.test(element.innerHTML)` を複数→ひとつでもtrueなら次へ
"category": "regular", "method": "textContent", "property": ["(ユーザ指定)"], "under": [ (下位要素) ]     |                       |`/property/.test(element.textContent)` を複数→ひとつでもtrueなら次へ
"category": "erase", "method": "outerHtml", "property": "(ユーザ指定)"                                  |underなし              |`element.outerHTML = property` 
"category": "erase", "method": "innerHtml", "property": "(ユーザ指定)"                                  |underなし              |`element.innerHTML = property` 
"category": "erase", "method": "innerText", "property": "(ユーザ指定)"                                  |underなし              |`element.innerText = property` 
"category": "erase", "method": "remove"                                                                 |propertyなし、underなし|`element.remove()` 
"category": "erase", "method": "height",    "property": "(ユーザ指定)"                                  |underなし              |`element.style.height = property` 

記述方法|内容
---     |---
"label":"(ユーザ指定)"  |要素に付け加えることでgoto用のラベルを設定。`document`は記述しなくても自動的にラベリングされている。
"goto": "(ユーザ指定)"  |ラベルへのジャンプ。深いタグのネストを行い、判断基準が見つかったときに「親要素も丸ごと削除したい！」というときに使用する。
