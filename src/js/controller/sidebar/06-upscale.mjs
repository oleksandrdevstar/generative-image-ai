/** @module controller/sidebar/05-upscale */
import { isEmpty, deepClone } from "../../base/helpers.mjs";
import { Controller } from "../base.mjs";
import { UpscaleStepsFormView } from "../../forms/enfugue/upscale.mjs";

/**
 * The overall controller registers the form in the sidebar.
 */
class UpscaleController extends Controller {
    /**
     * When asked for state, return values from form.
     */
    getState(includeImages = true) {
        return { "upscale": this.upscaleForm.values.steps };
    }

    /**
     * Get default state
     */
    getDefaultState() {
        return { 
            "upscale": []
        };
    }

    /**
     * When setting state, look for values from the upscale form
     */
    setState(newState) {
        if (!isEmpty(newState.upscale)) {
            let upscaleState = deepClone(newState.upscale);
            this.upscaleForm.setValues({steps: upscaleState}).then(() => {
                setTimeout(
                    () => this.upscaleForm.submit(),
                    250
                );
            });
        }
    }

    /**
     * When initialized, add form to sidebar.
     */
    async initialize() {
        this.upscaleForm = new UpscaleStepsFormView(this.config);
        this.upscaleForm.onSubmit(async (values) => {
            this.engine.upscaleSteps = values.steps;
        });
        
        this.subscribe("modelPickerChange", (newModel) => {
            if (!isEmpty(newModel)) {
                let defaultConfig = newModel.defaultConfiguration,
                    upscaleConfig = {};

                if (!isEmpty(defaultConfig.upscale_steps)) {
                    upscaleConfig.steps = defaultConfig.steps;
                }
                if (!isEmpty(upscaleConfig)) {
                    this.upscaleForm.setValues(upscaleConfig);
                }
            }
        });

        this.application.sidebar.addChild(this.upscaleForm);
    }
}

export { UpscaleController as SidebarController };
