
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Switch } from "../ui/switch";
import { Moon, Sun } from "lucide-react";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import CreateNewChat from "../chat/CreateNewChat";
import { useThemeStore } from "@/stores/useThemeStore";
import DirectMessageList from "../chat/DirectMessageList";
import GroupChatList from "../chat/GroupChatList";
import { useAuthStore } from "@/stores/useAuthStore";
import { NavUser } from "./nav-user";



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {isDark, toggleTheme} = useThemeStore();
  const {user} = useAuthStore()
  return (
    <Sidebar variant="inset" {...props}>
      {/* header */}
      <SidebarHeader>
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="bg-gradient-primary rounded-lg"
            >
              <a href="#" className="block w-full">
                <div className="flex w-full items-center px-2 justify-between">
                  <h1 className="text-xl font-bold text-white">Moji</h1>
                  <div className="flex items-center gap-2">
                    <Sun className="size-4 text-white/80" />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-background/80"
                    />
                    <Moon className="size-4 text-white/80" />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* content */}
      <SidebarContent className="beautiful-scrollbar">
        {/* New Chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group Chat */}
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="uppercase">nhóm chat</SidebarGroupLabel>
            <NewGroupChatModal />
          </div>

          <SidebarGroupContent>
            <GroupChatList/>
            {/* {convoLoading ? <ConversationSkeleton /> : <GroupChatList />} */}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dirrect Message */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">bạn bè</SidebarGroupLabel>
          <SidebarGroupAction
            title="Kết Bạn"
            className="cursor-pointer"
          >
            {/* <AddFriendModal /> */}
          </SidebarGroupAction>

          <SidebarGroupContent>
            <DirectMessageList/>
            {/* {convoLoading ? <ConversationSkeleton /> : <DirectMessageList />} */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* footer */}
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
