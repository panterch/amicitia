xml.instruct! :xml, :version => "1.0" 
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "advertisements"
    xml.description "advertisements near zurich"
    xml.link formatted_markers_url(:rss)
    
    for marker in @markers
      xml.item do
        xml.title marker.title
        xml.description marker.body
        xml.pubDate marker.created_at.to_s(:rfc822)
        xml.link formatted_marker_url(marker, :rss)
        xml.guid formatted_marker_url(marker, :rss)
      end
    end
  end
end
