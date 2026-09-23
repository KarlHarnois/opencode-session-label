/** @jsxImportSource @opentui/solid */
import type { TuiHostSlotMap, TuiPluginApi } from "@opencode-ai/plugin/tui"
import type { JSX } from "@opentui/solid"
import { useTerminalDimensions } from "@opentui/solid"
import type { BadgeView } from "./badge-view"

const BADGE_RIGHT_PADDING_COLUMNS = 0

export class SessionPromptSlot {
  constructor(
    private readonly api: TuiPluginApi,
    private readonly badges: BadgeView,
  ) {}

  render(props: SessionPromptProps): JSX.Element {
    const dimensions = useTerminalDimensions()
    const badge = () => this.badges.badge(props.session_id, dimensions().width)
    const Prompt = this.api.ui.Prompt
    const Slot = this.api.ui.Slot
    return (
      <box flexDirection="column" width="100%">
        <box
          flexDirection="row"
          width="100%"
          justifyContent="flex-end"
          paddingRight={BADGE_RIGHT_PADDING_COLUMNS}
        >
          <text wrapMode="none">
            <span style={{ bg: badge().background, fg: badge().foreground }}>{badge().text}</span>
          </text>
        </box>
        <Prompt
          sessionID={props.session_id}
          visible={props.visible}
          disabled={props.disabled}
          onSubmit={props.on_submit}
          ref={props.ref}
          right={<Slot name="session_prompt_right" session_id={props.session_id} />}
        />
      </box>
    )
  }
}

type SessionPromptProps = TuiHostSlotMap["session_prompt"]
