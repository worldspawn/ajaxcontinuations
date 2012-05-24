using System.Collections.Generic;

namespace MvcAjaxSupport.Mapping
{
    public class GenericResultMappingProvider
    {
        readonly IDictionary<string, IGenericResultMapping> _mappings = new Dictionary<string, IGenericResultMapping>();

        public void AddResultMapping(string[] mimeTypes, IGenericResultMapping genericResultMapping)
        {
            foreach (string mime in mimeTypes)
                _mappings.Add(mime, genericResultMapping);
        }

        public IGenericResultMapping GetMapping(string mimeType)
        {
            if (_mappings.ContainsKey(mimeType))
                return _mappings[mimeType];

            return null;
        }
    }
}