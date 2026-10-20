import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMailBody } from "../../api/character";
import MailModal from "./MailModal";
import type { MailListItem } from "./MailTypes";

vi.mock("../../api/character", () => ({
  getMailBody: vi.fn(),
}));

const mail: MailListItem = {
  character: "c",
  character_id: 1,
  mail_id: 2,
  from: "f",
  labels: ["Inbox", 7],
  recipients: ["a", "b"],
  timestamp: null,
  subject: "s",
};

const renderModal = (msg_data: MailListItem | null) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MailModal shown={true} setShown={() => {}} msg_data={msg_data} />
    </QueryClientProvider>,
  );

describe("MailModal", () => {
  beforeEach(() => {
    vi.mocked(getMailBody).mockReset();
  });

  it("doesn't fetch until a mail is picked", () => {
    renderModal(null);
    expect(getMailBody).not.toHaveBeenCalled();
  });

  it("doesn't fetch for a mail with no id", () => {
    renderModal({ ...mail, mail_id: null });
    expect(getMailBody).not.toHaveBeenCalled();
  });

  it("fetches the picked mail's body", async () => {
    vi.mocked(getMailBody).mockResolvedValue({ body: "hello" });
    renderModal(mail);

    expect(await screen.findByText("hello")).toBeInTheDocument();
    expect(getMailBody).toHaveBeenCalledWith(1, 2);
  });
});
