const getCurrency = (data) => {
  return !data?.currency?.id || data.currency.id === 1
    ? '$'
    : '';
}

export const renderBudget = (post) => {
  if (!post?.budget_type) return '';
  const currency = getCurrency(post);
  const budgetType = post?.budget_type ? post.budget_type.replace('_', ' ') : '';
  let output = "";
  switch (post.budget_type) {
    case 'contingency_fee':
      output = +post?.budget_min 
        ? output + post?.budget_min
        : output;
      break;
    case 'hourly': 
      output += currency + post?.budget_min;
      if (post.budget_max) {  
        output += '-' + currency + post?.budget_max;
      }
      break;
    default: 
      output += currency + post?.budget_min;
  }
  return [" ", output, budgetType].join(' ');
}

export const renderProposalRate = (proposal) => {
  const currency = getCurrency(proposal);
  if (!proposal?.rate_type) {
    return currency + proposal?.rate || '';
  }
  switch (proposal.rate_type) {
    case 'contingency_fee':
      return proposal?.rate;
    case 'hourly':
      return currency + proposal?.rate + `/hr`;
    default:
      return currency + proposal?.rate;
  }
}

export const renderLastMessageText = (last_message) => {
  if (!last_message || !last_message?.type) return '';
  switch (last_message.type) {
    case 'endCall':
      return 'Call ended';
    case 'voice':
      return 'Voice message';
      case 'text':
    default: 
      return last_message?.text || '';
  }
}