//==============================================================================
// EffekseerForRPGMakerMZ_Ex.js
// -----------------------------------------------------------------------------
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [GitHub] : https://github.com/effekseer/EffekseerForRPGMakerMZ_Ex
//==============================================================================

/*:
 * @target MZ
 * @url https://github.com/effekseer/EffekseerForRPGMakerMZ_Ex
 * @plugindesc Effekseer Extended plugin v1.52n - 1.00
 * @author Effekseer
 *
 * @help
 * It is a plugin to extend the functionality of Effekseer.
 * Change it if you want to use a large amount of effects that can't be displayed.
 * 
 * @param InstanceMaxCount
 * @desc The maximum number of instances that can be displayed at one time.
 * @type number
 * @default 10000
 * 
 * @param SquareMaxCount
 * @desc The maximum number of sprites that can be displayed at one time.
 * @type number
 * @default 10000
 * 
 */
/*:ja
 * @target MZ
 * @url https://github.com/effekseer/EffekseerForRPGMakerMZ_Ex
 * @plugindesc Effekseer 拡張プラグイン v1.52n - 1.00
 * @author Effekseer
 *
 * @help
 * Effekseer の機能を拡張するプラグインです。
 * 
 * @param InstanceMaxCount
 * @desc 一度に表示できるインスタンスの最大数。表示しきれない多量のエフェクトを使う場合は変更してください。
 * @type number
 * @default 10000
 * 
 * @param SquareMaxCount
 * @desc 一度に表示できるスプライトの最大数。表示しきれない多量のエフェクトを使う場合は変更してください。
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
                const actualInstanceMaxCount = (paramInstanceMaxCount) ? paramInstanceMaxCount : 10000;
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
