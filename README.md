# react-wizard

- [Introduction](#introduction)
- [What does react-wizard do?](#what-does-react-wizard-do)
- [The building blocks](#the-building-blocks)
- [Usage](#usage)
  - [Creating a wizard](#creating-a-wizard)
  - [Creating a multi step wizard](#creating-a-multi-step-wizard)
  - [Closing a wizard](#closing-a-wizard)
- [The step history](#the-step-history)
- [Wizard component/hook API](#wizard-componenthook-api)
- [FAQ](#faq)
  - [How do I persist changes made within a step?](#how-do-i-persist-changes-made-within-a-step)

## Introduction

Wizards lead the user through a series of steps to complete a task or process.
This react-wizard package is intended to make multi-step UI's easier to
implement.

## What does react-wizard do?

At a first glance it may seem a wizard is just about hiding a current component
and showing a new one whenever the user presses a button. But there are some
reasons why having a re-usable building block for this is useful:

- **Going back and forth between steps**: Often you want to allow the user to go
  back to a previous step to change something. If you hardcode in each step what
  the previous step is then its cumbersome to add more steps in-between later
  on. The Wizard component keeps a history of visited steps so to go back you
  can just ask the Wizard component to go back one step.
- **Non-lineair wizards with repeating steps**: sometimes during the process
  of a wizard the same step re-appears multiple times. If you would simply
  include each step component within your jsx and hide/show the appropriate step
  when necessary, then its tricky to go to that step with different props at
  different moments during the process. Instead, the wizard component deals with
  injecting the step the be opened with the correct props dynamically.
- **Transition animations**: The wizard steps in our app have animations when
  transitioning from one step to another. These animations are handled by the
  wizard component.

## The building blocks

Before giving some actual examples lets have a look to the two main building
blocks that you need to build a wizard: the `<Wizard>` component and the
`useWizard` hook. The Wizard component is what you use to create a wizard.

```tsx
<Wizard
  // The react component that is the initial step of the wizard
  initialStep={MyComponent}
  // The props to pass to the initialStep component
  initialStepProps={{ propA: "A", propB: "B" }}
  // A callback function that is called when the wizard closes
  onCloseWizard={() => console.log("Called when the wizard closes")}
/>
```

The `useWizard` hook is what a step uses to hook into the features and context
of the wizard. Any react component can be a wizard step, but to allow the step
to interact with the wizard's functionality you need to use the `useWizard()`
hook. The hook returns the following functions and values:

```tsx
const {
  // A function that when called removes the current active step from the step
  // history and makes the previous step the new active step. This causes
  // the previous step to be rendered again using the same component and props
  // it was initially rendered with.
  closeStep,
  // A function to open a component with specific props as the next step.
  openStep,
  // a function to close the wizard
  closeWizard,
  // An array of step instances. Can be used for debugging purposes or to show
  // the history of steps visited to the user.
  stepHistory,
  // The uuid assigned to the step
  uuid,
} = useWizard();
```

## Usage

### Creating a wizard

To create a wizard you simply render the `<Wizard>` component and pass it the
initial step to render and the props to render it with. The step is just a plain
react component.

```tsx
import { Wizard } from "~/components/Wizard/Wizard";

const SomeComponent = ({ title }) => {
  return <h1>{title}</h1>;
};
export default function App() {
  return <Wizard initialStep={SomeComponent} initialStepProps={{ title: "My title" }} />;
}
```

### Creating a multi step wizard

The above example is a single step wizard, not very useful. Lets create a
minimal example of a flow consisting of three steps through which you can go
back and forth:

```tsx
import { Wizard } from "~/components/Wizard/Wizard";
import { useWizard } from "~/components/Wizard/useWizard";
import { Button } from "~/components/primitives";

const App = () => {
  return <Wizard initialStep={Step1} initialStepProps={{}} />;
};

const Step1 = () => {
  const { openStep } = useWizard();
  return (
    <div className="border bg-white p-14">
      <h1>Step 1</h1>
      <Button onClick={() => closeStep()}>back</Button>
      <Button onClick={() => openStep(Step2, {})}>next</Button>
    </div>
  );
};

const Step2 = () => {
  const { openStep, closeStep } = useWizard();

  return (
    <div className="border bg-white p-14">
      <h1>Step 2</h1>
      <Button onClick={() => closeStep()}>back</Button>
      <Button onClick={() => openStep(Step3, {})}>next</Button>
    </div>
  );
};

const Step3 = () => {
  const { closeStep } = useWizard();

  return (
    <div className="border bg-white p-14">
      <h1>Step 3</h1>
      <Button onClick={() => closeStep()}>back</Button>
    </div>
  );
};
```

### Closing a wizard

To close a wizard you either need to keep closing steps with `closeStep()` until
all steps in the step history have been closed, or alternatively, you simply
unmount the `<Wizard>` component, for instance by detaching the parent element
that contains it.

## The step history

The wizard keeps track of a "step history" which is a trace of all the steps
that have been visited so far. A step is added to the step history when you
call `openStep()`. The current step is removed from the history when its closed
using `closeStep()`.

When calling `closeStep()` and there is no previous step to go back to the
wizard will call the `onCloseWizard` callback function (if provided). At this
point the Wizard component is not rendering anything anymore so there's nothing
visible for the user.

## Wizard component/hook API

TODO: explain all features exposed by the `<Wizard>` component and the
`useWizard` hook. Such as the supported options for opening and closing steps.

## FAQ

### How do I persist changes made within a step?

When you have made changes in a step (e.g. filled in a form) and
then go on to the next step, your next step can be given all the information it
needs by passing it via props. However, when you close a step the previous step
will be rendered with its initial props again. This means any progress that you
had made within that previous step has been lost (e.g a form you filled in).

Any progress that needs to be persisted should be placed in the redux store.
You will then manually need to make sure that redux state gets cleared when its
not needed anymore.

There are ideas to make persisting data easier, such as:

- Implement some kind of data persistence mechanism where the useWizard hook
  offers a method to persist data in a store and associate it with the current
  step. Clearing the data when its not needed anymore is then automated.
- Allow to override the original props that the previous component was
  initially rendered with when closing a step. That way the "progress" can be
  passed back and forth between steps via props.
