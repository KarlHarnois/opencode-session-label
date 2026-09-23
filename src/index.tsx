import type { TuiPluginApi, TuiPluginModule } from "@opencode-ai/plugin/tui"
import { BadgeView } from "./badge-view"
import { ColorCommand } from "./color-command"
import { ColorStore } from "./color-store"
import { Palette } from "./palette"
import { SessionPromptSlot } from "./session-prompt-slot"

const PLUGIN_ID = "session-label"
const COLORS_STORAGE_KEY = "session-label.colors"

const plugin: TuiPluginModule & { id: string } = {
  id: PLUGIN_ID,
  async tui(api: TuiPluginApi) {
    const palette = new Palette()
    const store = new ColorStore(api.kv, COLORS_STORAGE_KEY)
    const badges = new BadgeView(api.kv, store, api.state.session)
    const slot = new SessionPromptSlot(api, badges)

    new ColorCommand(api, api.route, palette, store).register()

    api.slots.register({
      slots: {
        session_prompt: (_context, props) => slot.render(props),
      },
    })
  },
}

export default plugin
