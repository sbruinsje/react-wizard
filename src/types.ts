import { ComponentType } from "react";

export type StepInstance<P = unknown> = {
  uuid: string;
  component: ComponentType<P>;
  props: P;
  keepInHistory: boolean;
  onDestroy?: () => void;
};

export type EmptyObject = Record<string, never>;

export type AnimationDirection = "backward" | "forward";

export type OpenStepOptions = {
  /**
   * The animate option controls whether the step should be opened with an animation or not. By
   * default this is set to true, but in some case you might want to open steps without an
   * animation. For instance if the wizard is opened in a modal and the modal already has an opening
   * animation, then you could disable the animation for the first step of the wizard.
   */
  animate?: boolean;
  /**
   * The direction option controls whether to animate the step as if your going forward or
   * backwards. This is useful when your at the end of a wizard flow and want to open the starting
   * step again. In that case you are opening a step, but to the user it feels as if you're going
   * back so we should animate it as such.
   */
  direction?: AnimationDirection;
  /**
   * The keepInHistory option determines if this step will be kept in the stepHistory once a new
   * step is opened. When a step is kept in the step history its possible to go back to the step
   * by closing the step that was opened after it. By default steps are kept in history, but
   * sometimes you do not care for ever going back to that step.
   */
  keepInHistory?: boolean;
  /**
   * By setting purgeHistory to true the stepHistory is emptied and their associated onDestroy
   * handlers are called in order as if they were closed one by one. Then the new step is opened.
   */
  purgeHistory?: boolean;
};

export type CloseStepOptions = {
  animate?: boolean;
  direction?: AnimationDirection;
};
