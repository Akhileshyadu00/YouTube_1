const suggestions = [
  {
    title: "10 Amazing CSS Tricks",
    channel: "DesignHub",
    thumbnail: "https://media.istockphoto.com/id/1476727591/photo/carbon-balance-is-zero-the-hand-of-pollution-and-efficient-management-with-netzero-symbols.jpg?s=612x612&w=0&k=20&c=cQMqh5l8N03R7ogJWDNFf3XYJvhd-XCX0U5s3ScB8l8=",
    video: "/watch/def456",
  },
  {
    title: "JavaScript Async Explained",
    channel: "JS Academy",
    thumbnail: "https://media.istockphoto.com/id/1470986827/photo/businessman-using-laptop-with-ai-tech-auto-insurance-service-concept-travel-insurance-data.jpg?s=612x612&w=0&k=20&c=AKBV608awZR1hULillcxPSbgSF2S_J7kl4bFp9GO3nM=",
    video: "/watch/ghi789",
  },
   {
    title: "JavaScript Async Explained",
    channel: "JS Academy",
    thumbnail: "https://media.istockphoto.com/id/2149600154/photo/cost-reduction-business-finance-concept-businessman-with-virtual-screen-of-cost-reduction.jpg?s=612x612&w=0&k=20&c=1OPm-IVkAmluxq2XwsV4dtRs79WxJIXdx5Adac4r1kE=",
    video: "/watch/ghi789",
  },
   {
    title: "JavaScript Async Explained",
    channel: "JS Academy",
    thumbnail: "https://media.istockphoto.com/id/1279995716/vector/a-hand-holds-a-help-sign-from-a-mobile-phone.jpg?s=612x612&w=0&k=20&c=Na1p_rmuYSsB5l551ZP-0PHchiBlo1-ac-_n43EcSS8=",
    video: "/watch/ghi789",
  },
   {
    title: "JavaScript Async Explained",
    channel: "JS Academy",
    thumbnail: "https://media.istockphoto.com/id/1255060726/vector/businesswoman-coach-presenting-anti-crisis-concept-deadline-plan-for-bankrupt-company-income.jpg?s=612x612&w=0&k=20&c=oYIGVT_Rc1GpuBGEXHF3nglHs2Y0dbr7RZHOddOr_Ng=",
    video: "/watch/ghi789",
  },
   {
    title: "JavaScript Async Explained",
    channel: "JS Academy",
    thumbnail: "https://media.istockphoto.com/id/1282840278/photo/neon-sign-cyber-week.jpg?s=612x612&w=0&k=20&c=HngdnchOA2XxNtaoFW4QVRq4T1KhEvgnF_WCcGZZSpc=",
    video: "/watch/ghi789",
  },
   {
    title: "JavaScript Async Explained",
    channel: "JS Academy",
    thumbnail: "https://media.istockphoto.com/id/1169700200/photo/risk-management-and-assessment-for-business.jpg?s=612x612&w=0&k=20&c=c-pc4KbAJftsArUQMPc2NqyYWlm7TjcO0hW81KdNKIc=",
    video: "/watch/ghi789",
  },
  
];

import { Link } from "react-router-dom";

export default function Suggestion() {
  return (
    <aside className="w-full lg:w-1/4 flex flex-col gap-4">
      <h3 className="text-white text-lg font-semibold mb-2">Suggestions</h3>
      {suggestions.map((item, idx) => (
        <Link to={item.video} key={idx}>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded">
            <img
              src={item.thumbnail}
              alt={`Suggested video ${idx + 1}`}
              className="w-24 h-16 object-cover rounded"
            />
            <div className="flex flex-col">
              <span className="text-white text-sm line-clamp-2">
                {item.title}
              </span>
              <span className="text-gray-400 text-xs">{item.channel}</span>
            </div>
          </div>
        </Link>
      ))}
    </aside>
  );
}
