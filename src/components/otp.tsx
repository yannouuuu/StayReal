import { Show, type VoidComponent } from 'solid-js'
import OtpField from '@corvu/otp-field'

const Otp: VoidComponent<{ submit: (code: string) => void }> = (props) => {
  return (
    <div class="flex w-full items-center justify-center">
      <OtpField maxLength={6} class="flex" onComplete={(code) => props.submit(code)}>
        <OtpField.Input aria-label="Verification Code" />
        <div class="flex items-center space-x-2">
          <Slot index={0} />
          <Slot index={1} />
          <Slot index={2} />
          <Slot index={3} />
          <Slot index={4} />
          <Slot index={5} />
        </div>
      </OtpField>
    </div>
  )
}

const Slot = (props: { index: number }) => {
  const context = OtpField.useContext()
  const char = () => context.value()[props.index]
  const showFakeCaret = () =>
    context.value().length === props.index && context.isInserting()

  return (
    <div
      class='flex size-10 items-center justify-center rounded-md bg-white/10 font-600'
      classList={{
        'ring-white ring-2': context.activeSlots().includes(props.index),
      }}
    >
      {char()}
      <Show when={showFakeCaret()}>
        <div class="pointer-events-none flex items-center justify-center">
          <div class="h-4 w-px animate-pulse bg-white animate-duration-1000" />
        </div>
      </Show>
    </div>
  )
}

export default Otp
