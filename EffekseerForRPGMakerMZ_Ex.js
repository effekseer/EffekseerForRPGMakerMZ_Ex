//==============================================================================
// EffekseerForRPGMakerMZ_Ex.js
// -----------------------------------------------------------------------------
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [GitHub] : https://github.com/effekseer/EffekseerForRPGMakerMZ_Ex
//==============================================================================

/*:ja
 * @target MZ
 * @url https://raw.githubusercontent.com/munokura/Effekseer-sample-for-RPG-Tkool-MZ/master/Effekseer_RPGMakerMZ_Patch.js
 * @plugindesc Effekseer 拡張プラグイン v1.52m
 * @author Effekseer
 *
 * @help
 * EffekseerForRPGMakerMZ_Ex.js
 * 
 * Effekseer の調整を行うための各種パラメータを提供します。
 * 
 * このプラグインを使用するためには、Effekseer のコアスクリプトを更新する必要があります。
 * 
 * 1. 次のダウンロードサイトから、本プラグインのバージョンと同一の「Effekseer for WebGL」をダウンロードしてください。
 *    http://effekseer.github.io/jp/download.html
 * 2. 「effekseer.min.js」と「effekseer.wasm」をそれぞれ js/libs フォルダ内のファイルへ上書きしてください。
 * 
 * @param InstanceMaxCount
 * @desc 一度に表示できるインスタンスの最大数。デフォルトでは表示しきれない多量のエフェクトを使う場合は変更してください。
 * @type number
 * @default 4000
 * 
 * @param SquareMaxCount
 * @desc 一度に表示できるスプライトの最大数。デフォルトでは表示しきれない多量のエフェクトを使う場合は変更してください。
 * @type number
 * @default 10000
 * 
 */

(() => {
    'use strict'
    var pluginName = 'EffekseerForRPGMakerMZ_Ex';

    var paramInstanceMaxCount = Number(PluginManager.parameters(pluginName)['InstanceMaxCount']);
    var paramSquareMaxCount = Number(PluginManager.parameters(pluginName)['SquareMaxCount']);

    Graphics._createEffekseerContext = function () {
        if (this._app && window.effekseer) {
            try {
                const actualInstanceMaxCount = (paramInstanceMaxCount) ? paramInstanceMaxCount : 4000;
                const actualSquareMaxCount = (paramSquareMaxCount) ? paramSquareMaxCount : 10000;

                this._effekseer = effekseer.createContext();
                if (this._effekseer) {
                    this._effekseer.init(this._app.renderer.gl, { instanceMaxCount: actualInstanceMaxCount, squareMaxCount: actualSquareMaxCount });
                }
            } catch (e) {
                this._app = null;
            }
        }
    };
})();
