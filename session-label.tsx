/** @jsxImportSource @opentui/solid */
import { useTerminalDimensions } from "@opentui/solid"
import type { TuiPlugin, TuiPluginApi, TuiPluginModule } from "@opencode-ai/plugin/tui"
import { createSignal } from "solid-js"

const PALETTE = [
  "#e06c75",
  "#98c379",
  "#e5c07b",
  "#61afef",
  "#c678dd",
  "#56b6c2",
  "#d19a66",
  "#7fbbb3",
  "#d699b6",
  "#a3be8c",
]

const KV_KEY = "session-label.colors"
const DEFAULT_TITLE_PATTERN = /^(New session|Child session) - \d{4}-\d{2}-\d{2}T/
const WIDE_SIDEBAR_WIDTH = 120
const SIDEBAR_COLUMNS = 42
const BADGE_RESERVED_COLUMNS = 8
const MIN_TITLE_LENGTH = 10

type ColorMap = Record<string, string>

function hash(value: string) {
  let acc = 0
  for (const char of value) acc = (acc * 31 + char.codePointAt(0)!) >>> 0
  return acc
}

function storedColors(raw: unknown): ColorMap {
  if (typeof raw !== "object" || raw === null) return {}
  return Object.fromEntries(Object.entries(raw).filter(([, color]) => typeof color === "string")) as ColorMap
}

function truncate(value: string, limit: number) {
  if (value.length <= limit) return value
  return `${value.slice(0, limit - 1)}…`
}

function contrastText(badgeColor: string) {
  const value = badgeColor.replace("#", "")
  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255
  return luminance > 0.6 ? "#1c1c1c" : "#f5f5f5"
}

function displayTitle(api: TuiPluginApi, sessionID: string) {
  const title = api.state.session.get(sessionID)?.title
  if (!title || DEFAULT_TITLE_PATTERN.test(title)) return "new session"
  return title
}

function availableColumns(terminalWidth: number, sidebarMode: unknown) {
  const sidebarVisible = sidebarMode !== "hide" && terminalWidth > WIDE_SIDEBAR_WIDTH
  return terminalWidth - (sidebarVisible ? SIDEBAR_COLUMNS : 0) - BADGE_RESERVED_COLUMNS
}

const sessionLabel: TuiPlugin = async (api) => {
  const [colors, setColors] = createSignal(storedColors(api.kv.get(KV_KEY, {})))
  const colorFor = (sessionID: string) => colors()[sessionID] ?? PALETTE[hash(sessionID) % PALETTE.length]
  const activeSessionID = () => {
    const current = api.route.current
    return current.name === "session" ? current.params.sessionID : undefined
  }

  api.keymap.registerLayer({
    commands: [
      {
        name: "session_label.color",
        title: "Session label color",
        category: "Session",
        namespace: "palette",
        slashName: "color",
        run() {
          const sessionID = activeSessionID()
          if (!sessionID) return
          api.ui.dialog.replace(() => (
            <api.ui.DialogSelect
              title="Session label color"
              options={PALETTE.map((color) => ({ title: color, value: color }))}
              current={colorFor(sessionID)}
              onSelect={(option) => {
                setColors({ ...colors(), [sessionID]: option.value as string })
                api.kv.set(KV_KEY, colors())
                api.ui.dialog.clear()
              }}
            />
          ))
        },
      },
    ],
  })

  api.slots.register({
    slots: {
      session_prompt(_context, props) {
        const dimensions = useTerminalDimensions()
        const budget = () =>
          Math.max(
            MIN_TITLE_LENGTH,
            availableColumns(dimensions().width, api.kv.get("sidebar", "auto")),
          )
        return (
          <box flexDirection="column" width="100%">
            <box flexDirection="row" width="100%" justifyContent="flex-end">
              <text wrapMode="none">
                <span style={{ bg: colorFor(props.session_id), fg: contrastText(colorFor(props.session_id)) }}>
                  {` ${truncate(displayTitle(api, props.session_id), budget())} `}
                </span>
              </text>
            </box>
            <api.ui.Prompt
              sessionID={props.session_id}
              visible={props.visible}
              disabled={props.disabled}
              onSubmit={props.on_submit}
              ref={props.ref}
              right={<api.ui.Slot name="session_prompt_right" session_id={props.session_id} />}
            />
          </box>
        )
      },
    },
  })
}

const plugin: TuiPluginModule & { id: string } = {
  id: "session-label",
  tui: sessionLabel,
}

export default plugin
