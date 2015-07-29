FlashAir List.htm サンプル
===================

WiFi対応のSDメモリカードである [TOSHIBA FlashAir(TM)](http://www.toshiba.co.jp/p-media/flashair/) のウェブブラウザからのアクセスするページをカスタマイズするサンプルです。

FlashAirへのファイルのアクセスには通常WiFi接続でウェブブラウザを使って閲覧、ファイルのダウンロードなどを行います。この時表示されるページは[FlashAir SDカード上の隠しファイルを使って自由にカスタマイズすることができます](https://flashair-developers.com/ja/documents/api/utility/)。今回は最近のはやりのJavascriptライブラリを使って今風にカスタマイズしたもの一式を公開します。

####Smartphone:
![FlashAir List.htm replacement](https://cloud.githubusercontent.com/assets/318651/7998144/4a959fd4-0b73-11e5-9bd0-d4184d5ac649.jpg)

####FullHD screen:
![FlashAir List.htm replacement](https://cloud.githubusercontent.com/assets/318651/7998154/65faefb8-0b73-11e5-932f-abab2de64232.jpg)
####特徴

- FlashAir のブラウザ画面のカスタマイズでディレクトリの一覧をBootstrapとIsotopeでレスポンシブ、ダイナミックなタイル表示を実現
- PhotoSwipeによるタッチ対応のスライド表示
- 接続インジケーターでFlashAirの電源状態をリアルタイムに確認
- 「管理者」の場合の設定ページへのリンクはFlashAir内臓のものへそのままリンクを表示するなどなるべくオリジナルの利便性を犠牲にしない
- (カンマを含むファイル、ディレクトリ名でもポーリングに失敗しません。)

###動作確認
- FlashAir W-03
LUAなど 03 に依存した機能は使用していませんが、内臓のスクリプトファイル、画像リソースなどを再利用している都合、古いファームウェアではどうなるか未確認です。
~~※バージョン１のファームウェアでは動作しません。~~
V1ファームのAPIとの互換性対応のライブラリを使っています。

- FlashAir W-01 / W-02 の動作情報求む

###依存ライブラリ

- [jQuery](https://jquery.com/) v1.11.3 MIT
- [Bootstrap](http://getbootstrap.com/) v3.3.4 MIT
- [Isotope](http://isotope.metafizzy.co/) GPLv3
- [Photoswipe](http://photoswipe.com/) MIT

比較的新しい技術を用いた結果、IE8などの古いブラウザとの互換性は犠牲になっています。

###インストール方法
本パッケージにある SD_WLAN ディレクトリの内容を FlashAir のSDカードドライブのルートディレクトリにそのまま上書きしてコピーします。
この際既存のSD_WLANディレクトリ（隠しディレクトリ）を上書きするか問われますがそのまま続行します。CONFIGファイルなど重要なファイルは上書きされません。

###アンインストール方法
本パッケージのSD_WLANディレクトリにあるファイルをFlashAir SDカードからすべて削除します。（手作業で・・・）
ただし、一時的にFlashAir内臓のものに戻すだけであれば、 SD_WLANディレクトリの List.htm ファイルを削除またはファイル名を別名に変更するだけでかまいません。

改定履歴
-------------
- Ver1ファームウェアとの互換性。(2015.7.29)
- パッケージし直し版。シングルページナビゲーション対応。(2015.6.23)
-  初回リリース (2015.6.4)

ライセンス
-------------
(IsotopeがGPLv3である都合おそらく)
GPLv3ライセンス
(c) 2015 Yokinsoft http://www.yo-ki.com
