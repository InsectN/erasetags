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
