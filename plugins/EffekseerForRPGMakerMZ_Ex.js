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
 * @plugindesc Effekseer Extended plugin v1.62d - 1.03
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
 * @plugindesc Effekseer 拡張プラグイン v1.62d - 1.03
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
            // prettier-ignore
            Graphics.effekseer.setProjectionMatrix([
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, -0.01, 0,
                0, 0, 0, 10,
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
            const halfW = renderer.view.width / 2;
            const pos = this.targetPosition(renderer);
            const vx = this._animation.offsetX;
            const vy = this._animation.offsetY;
            const x = (this._mirror) ? (-((pos.x - vx) - halfW)) + halfW : (pos.x + vx);
            this._handle.setLocation(
                ((x - renderer.view.width / 2.0) / (renderer.view.height / 2.0)) * 10.0,
                -((pos.y + vy) / renderer.view.height * 2.0 - 1.0) * 10.0,
                0);
            renderer.gl.viewport(0, 0, renderer.view.width, renderer.view.height);
        };

        Sprite_Animation.prototype.updateEffectGeometry = function() {
        };

        Sprite_Animation.prototype.updateEffectGeometryOnRender = function() {
            const scale = this._animation.scale / 100;
            const r = Math.PI / 180;
            const rx = this._animation.rotation.x * r;
            const ry = this._animation.rotation.y * r;
            const rz = this._animation.rotation.z * r;
            if (this._handle) {
                this._handle.setLocation(0, 0, 0);
                this._handle.setRotation(rx, ry, rz);
                this._handle.setScale(scale, scale, scale);
                this._handle.setSpeed(this._animation.speed / 100);
            }
        };

        Graphics._onTick = function(deltaTime) {
            this._fpsCounter.startTick();
            if (this._tickHandler) {
                this._tickHandler(deltaTime);
            }
            if (this._canRender()) {
                this.isBackgroundCaptured = false;
                this._app.render();
            }
            this._fpsCounter.endTick();
        };

        Sprite_Animation.prototype._render = function (renderer) {
            this.updateEffectGeometryOnRender();

            if (this._targets.length > 0 && this._handle && this._handle.exists) {
                this.onBeforeRender(renderer);
                this.setProjectionMatrix(renderer);
                this.setCameraMatrix(renderer);
                this.setViewport(renderer);
                if(!this.isBackgroundCaptured)
                {
                    Graphics.effekseer.captureBackground(0, 0, renderer.view.width, renderer.view.height);
                    this.isBackgroundCaptured = true;
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
