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
 * @plugindesc Effekseer Extended plugin v1.53b - 1.00
 * @author Effekseer
 *
 * @help
 * It is a plugin to extend the functionality of Effekseer.
 * Optimize a performance.
 *
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
 * @param DistortionEnabled
 * @desc Enables/disables effect distortion.
 * @type boolean
 * @default false
 * 
 */
/*:ja
 * @target MZ
 * @url https://github.com/effekseer/EffekseerForRPGMakerMZ_Ex
 * @plugindesc Effekseer 拡張プラグイン v1.53b - 1.00
 * @author Effekseer
 *
 * @help
 * Effekseer の機能を拡張するプラグインです。
 * パフォーマンスを最適化します。
 * 
 * 表示しきれない多量のエフェクトを使う場合は変更してください。
 * 
 * @param InstanceMaxCount
 * @desc 一度に表示できるインスタンスの最大数。
 * @type number
 * @default 10000
 * 
 * @param SquareMaxCount
 * @desc 一度に表示できるスプライトの最大数。
 * @type number
 * @default 10000
 * 
 * @param DistortionEnabled
 * @desc エフェクトの歪みを有効にするかどうか。
 * @type boolean
 * @default false
 * 
 */

(() => {
    'use strict'
    var pluginName = 'EffekseerForRPGMakerMZ_Ex';

    var paramInstanceMaxCount = Number(PluginManager.parameters(pluginName)['InstanceMaxCount']);
    var paramSquareMaxCount = Number(PluginManager.parameters(pluginName)['SquareMaxCount']);
    var isDistortionEnabled = PluginManager.parameters(pluginName)['DistortionEnabled'] != "false";

    Graphics._createEffekseerContext = function () {
        if (this._app && window.effekseer) {
            try {
                const actualInstanceMaxCount = (paramInstanceMaxCount) ? paramInstanceMaxCount : 10000;
                const actualSquareMaxCount = (paramSquareMaxCount) ? paramSquareMaxCount : 10000;

                this._effekseer = effekseer.createContext();
                if (this._effekseer) {
                    this._effekseer.init(this._app.renderer.gl, { instanceMaxCount: actualInstanceMaxCount, squareMaxCount: actualSquareMaxCount });
                }

                // restore OpenGL states with pixi.js functions
                this._effekseer.setRestorationOfStatesFlag(false);

            } catch (e) {
                this._app = null;
            }
        }
    };

    Sprite_Animation.prototype.onAfterRender = function (renderer) {
        renderer.texture.reset();
        renderer.geometry.reset();
        renderer.state.reset();
        renderer.shader.reset();
        renderer.framebuffer.reset();
    };

    if (isDistortionEnabled) {
        Sprite_Animation.prototype.setProjectionMatrix = function (renderer) {
            const x = (this._mirror ? -1 : 1) * renderer.view.height / renderer.view.width;
            const y = -1;
            const p = -1.0;
            // prettier-ignore
            Graphics.effekseer.setProjectionMatrix([
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, 1, p,
                0, 0, 0, 1,
            ]);
        };

        Sprite_Animation.prototype.setCameraMatrix = function (/*renderer*/) {
            // prettier-ignore
            Graphics.effekseer.setCameraMatrix([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, -10, 1
            ]);
        };

        Sprite_Animation.prototype.setViewport = function (renderer) {
            const vw = this._viewportSize;
            const vh = this._viewportSize;
            const vx = this._animation.offsetX - vw / 2;
            const vy = this._animation.offsetY - vh / 2;
            const pos = this.targetPosition(renderer);
            this._handle.setLocation(
                ((pos.x - renderer.view.width / 2.0) / (renderer.view.height / 2.0)) * 10.0,
                -(pos.y / renderer.view.height * 2.0 - 1.0) * 10.0,
                0);
            renderer.gl.viewport(0, 0, renderer.view.width, renderer.view.height);
        };

        Graphics._onTick = function(deltaTime) {
            this._fpsCounter.startTick();
            if (this._tickHandler) {
                this._tickHandler(deltaTime);
            }
            if (this._canRender()) {
                isBackgroundCaptured = false;
                this._app.render();
            }
            this._fpsCounter.endTick();
        };

        Sprite_Animation.prototype._render = function (renderer) {
            if (this._targets.length > 0 && this._handle && this._handle.exists) {
                this.onBeforeRender(renderer);
                this.saveViewport(renderer);
                this.setProjectionMatrix(renderer);
                this.setCameraMatrix(renderer);
                this.setViewport(renderer);
                if(!isBackgroundCaptured)
                {
                    Graphics.effekseer.captureBackground(0, 0, renderer.view.width, renderer.view.height);
                    isBackgroundCaptured = true;
                }
                Graphics.effekseer.beginDraw();
                Graphics.effekseer.drawHandle(this._handle);
                Graphics.effekseer.endDraw();
                this.resetViewport(renderer);
                this.onAfterRender(renderer);
            }
        };
    }
})();
