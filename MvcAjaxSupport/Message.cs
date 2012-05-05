using ajaxcontinuations.Mvc;

namespace MvcAjaxSupport
{
    public class Message
    {
        public Message(string text) : this(text, MessageCategory.Info)
        {
        }

        public Message(string text, MessageCategory category)
            : this(text, category, null)
        {
            
        }

        public Message(string text, MessageCategory category, string field)
        {
            Text = text;
            Category = category;
            Field = field;
        }

        public string Text { get; set; }
        public MessageCategory Category { get; set; }
        public string Field { get; set; }
    }
}