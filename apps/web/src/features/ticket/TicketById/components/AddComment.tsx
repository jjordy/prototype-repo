import { FormSchema } from "@/components/Forms";
import { Button } from "@jjordy/ui";

export default function AddComment({ createComment, ticket, user }: any) {
  return (
    <div className="py-4">
      <FormSchema
        defaultValues={{
          ticket_id: ticket?.id,
          author_id: user?.id,
        }}
        name="add_comment_form"
        debug
        onSubmit={createComment}
        schema={{
          $schema: "http://json-schema.org/draft-07/schema#",
          properties: {
            content: {
              type: "object",
              component: "rte",
              title: "Add a comment",
              isNotEmpty: true,
            },
          },
        }}
      >
        {() => (
          <>
            <div className="flex justify-end">
              <Button type="submit" className="">
                Save Comment
              </Button>
            </div>
          </>
        )}
      </FormSchema>
    </div>
  );
}
